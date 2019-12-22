from rest_framework.viewsets import ModelViewSet

from .serializers import ClientSerializer, InvoiceSerializer, InvoiceItemSerializer
from .models import Client, Invoice, InvoiceItem


class ClientViewSet(ModelViewSet):
    queryset = Client.objects.filter(is_active=True)
    serializer_class = ClientSerializer

    def get_queryset(self):
        return getActiveClients()


class InvoiceViewSet(ModelViewSet):
    queryset = Invoice.objects.filter(is_active=True)
    serializer_class = InvoiceSerializer    

    def get_queryset(self):
        return getActiveInvoices(self.request.user.id)

class InvoiceItemViewSet(ModelViewSet):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer


def getActiveInvoices(user_id):
   return Invoice.objects.filter(is_active=True, created_by=user_id)


def getActiveClients():
   return Client.objects.filter(is_active=True)
