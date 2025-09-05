from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets, permissions

from django.db.models import Count
from django.utils.timezone import now, timedelta


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import WaterPoint, IssueReport, RepairLog
from .serializer import WaterPointSerializer, IssueReportSerializer, RepairLogSerializer



@api_view(['GET', 'POST'])
def water_points_list(request):
    if request.method == 'GET':
        query = request.query_params.get('q', None)
        water_points = WaterPoint.objects.all()
        if query:
            water_points = water_points.filter(
                village__icontains=query
            ) | water_points.filter(
                district__icontains=query
            ) | water_points.filter(
                name__icontains=query
            )
        serializer = WaterPointSerializer(water_points, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = WaterPointSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def water_point_detail(request, pk):
    try:
        water_point = WaterPoint.objects.get(pk=pk)
    except WaterPoint.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = WaterPointSerializer(water_point)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = WaterPointSerializer(water_point, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def issue_reports_list(request):
    if request.method == 'GET':
        issue_reports = IssueReport.objects.all()
        serializer = IssueReportSerializer(issue_reports, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data.copy()
        data['reported_by'] = request.user.id
        serializer = IssueReportSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def issue_report_detail(request, pk):
    try:
        issue_report = IssueReport.objects.get(pk=pk)
    except IssueReport.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = IssueReportSerializer(issue_report)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = IssueReportSerializer(issue_report, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        issue_report.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def repair_logs_list(request):
    if request.method == 'GET':
        repair_logs = RepairLog.objects.all()
        serializer = RepairLogSerializer(repair_logs, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = RepairLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def repair_log_detail(request, pk):
    try:
        repair_log = RepairLog.objects.get(pk=pk)
    except RepairLog.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = RepairLogSerializer(repair_log)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = RepairLogSerializer(repair_log, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        repair_log.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def dashboard_summary(request):
    total = WaterPoint.objects.count()
    working = WaterPoint.objects.filter(status="working").count()
    not_working = total - working

    
    by_district = (
        WaterPoint.objects.values("raw_address__state")
        .annotate(count=Count("id"))
        .order_by("-count")
    )


    by_region = (
        WaterPoint.objects.values("district")
        .annotate(count=Count("id"))
        .order_by("-count")
    )

    
    recent = WaterPoint.objects.order_by("-created_at")[:5]
    recent_data = [
        {
            "id": wp.id,
            "name": wp.name,
            "district": wp.district,
            "village": wp.village,
            "status": wp.status,
            "created_at": wp.created_at,
        }
        for wp in recent
    ]

    return Response({
        "total_waterpoints": total,
        "working_waterpoints": working,
        "not_working_waterpoints": not_working,
        "by_district": {item["raw_address__state"]: item["count"] for item in by_district if item["raw_address__state"]},
        "by_region": {item["district"]: item["count"] for item in by_region if item["district"]},
        "recently_added": recent_data,
    })
