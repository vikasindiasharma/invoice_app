from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Client(models.Model):
    name = models.CharField(max_length=50, null=False)
    address = models.CharField(max_length=100, null=False)
    city = models.CharField(max_length=50, null=False)
    state = models.CharField(max_length=50, null=False)
    country = models.CharField(max_length=50, null=False)
    zip_code = models.CharField(max_length=10, null=False)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(default=datetime.now)

class Invoice(models.Model):
    version = models.IntegerField(default=0)
    invoice_number = models.CharField(max_length=10)
    issue_date = models.DateField(default=datetime.now)
    tax = models.DecimalField(decimal_places=2, max_digits=10)
    subtotal = models.DecimalField(decimal_places=2, max_digits=20,default=0)
    grandtotal = models.DecimalField(decimal_places=2, max_digits=20,default=0)
    invoice_terms = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE,related_name='client')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(default=datetime.now)
    

class InvoiceItem(models.Model): 
    item_name= models.CharField(max_length=50)
    item_description= models.CharField(max_length=100)
    unit_cost = models.DecimalField(decimal_places=2, max_digits=20)
    quantity = models.IntegerField(default=1)
    amount=models.DecimalField(decimal_places=2, max_digits=20)
    invoice_id = models.ForeignKey(Invoice, on_delete=models.CASCADE,related_name='items')

    def __unicode__(self):
        return '%d: %s' % (self.unit_cost, self.quantity)