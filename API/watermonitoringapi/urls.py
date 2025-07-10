from django.urls import path
from . import views

urlpatterns = [
    path('waterpoints/', views.water_points_list),
    path('waterpoints/<int:pk>/', views.water_point_detail),

    path('issuereports/', views.issue_reports_list),
    path('issuereports/<int:pk>/', views.issue_report_detail),
    path('repairlogs/', views.repair_logs_list),
    path('repairlogs/<int:pk>/', views.repair_log_detail),
]
