from django.contrib import admin
from .models import WaterPoint, IssueReport, RepairLog

admin.site.register(WaterPoint)
admin.site.register(IssueReport)
admin.site.register(RepairLog)
