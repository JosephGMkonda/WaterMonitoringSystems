from django.db import models
from django.conf import settings



class WaterPoint(models.Model):
    name = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    village = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    STATUS_CHOICES = [
        ('working', 'working'),
        ('not_working', 'not_working'),
        ('under_maintenance', 'under_maintenance')
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='working')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}- {self.district}- {self.village}"


class IssueReport(models.Model):
    water_point = models.ForeignKey(WaterPoint, on_delete=models.CASCADE, related_name='issue_reports')
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='issue_reports')
    description = models.TextField()
    reported_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('fixed', 'Fixed')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Issue at {self.water_point.name} - {self.status}"

class RepairLog(models.Model):
    issue = models.ForeignKey(IssueReport, on_delete=models.CASCADE, related_name='repairs')
    technician = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    fixed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField()

    def __str__(self):
        return f"Repair for {self.issue.id} by {self.technician}"
