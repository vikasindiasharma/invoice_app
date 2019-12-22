from rest_framework import serializers

from .models import Client, Invoice,InvoiceItem
import json

class ClientSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = Client
        fields = '__all__'


class InvoiceItemSerializer(serializers.ModelSerializer):    
    class Meta:
        model = InvoiceItem
        fields = ['item_name', 'item_description', 'unit_cost','quantity','amount']
        

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True,read_only=False)
    client =ClientSerializer(many=False,read_only=True)
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only =['version','invoice_number']

    def validate(self, data):
        return data

    def saveInvoice (self, newInvoice):
        item_data = newInvoice.pop('items')
        invoice = Invoice.objects.create(**newInvoice)
        print(invoice)
        for invoice_item in item_data:
            print(invoice_item)
            InvoiceItem.objects.create(invoice_id=invoice, **invoice_item)
        return invoice

    def create(self, newInvoice):
           invoice_number  =   getActiveInvoices(newInvoice['created_by'].id).count() +1
           newInvoice['invoice_number'] = invoice_number
           newInvoice['version'] =1
           return self.saveInvoice(newInvoice)

    def update(self, currentInvoice, newInvoice):
        if currentInvoice.is_active == False:
            raise serializers.ValidationError('Inactive invoices can not be modified.')
        if newInvoice['is_active'] == False: # delete operation
            currentInvoice.is_active = False
            currentInvoice.save()
            return currentInvoice
        else:
            newInvoice["version"] = currentInvoice.version +1
            newInvoice["invoice_number"]=currentInvoice.invoice_number
            currentInvoice.is_active = False
            currentInvoice.save()
        return  self.saveInvoice(newInvoice)


def getActiveInvoices(user_id):
   return Invoice.objects.filter(is_active=True, created_by=user_id)