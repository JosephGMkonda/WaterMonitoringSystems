from rest_framework import serializers
from .models import WaterPoint, IssueReport, RepairLog



class WaterPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterPoint
        fields = '__all__'

class IssueReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueReport
        fields ='__all__'

class RepairLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairLog
        fields = '__all__'

