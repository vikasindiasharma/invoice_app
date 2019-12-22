from .api import ClientViewSet, InvoiceViewSet,InvoiceItemViewSet
from rest_framework.routers import DefaultRouter
from .views import InvoiceList, InvoiceEdit, InvoiceDownload, InvoiceView
from django.urls import path , include

router = DefaultRouter()
router.register(r'api/client', ClientViewSet)
router.register(r'api/invoice', InvoiceViewSet)
router.register(r'api/invoiceitem', InvoiceItemViewSet)


urlpatterns = [
path('', InvoiceList),
    path(r'list', InvoiceList),
    path('detail', InvoiceEdit),
    path('edit/<int:id>/', InvoiceEdit),
    path('view/<int:id>/', InvoiceView),
    path('download/<int:id>/', InvoiceDownload),
    path('', include(router.urls)),
]