from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from .models import Client, Invoice, InvoiceItem
import pdfkit
from django.template.loader import get_template
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.decorators import login_required
from .api import getActiveInvoices
@login_required
def InvoiceList(request):
    invoices = getActiveInvoices(request.user.id)
    total_invoices = invoices.count()
    return render(request, 'invoice_list.html', {"invoices": invoices,'total_invoices' : total_invoices})

@login_required
def InvoiceEdit(request, id=0):
    new_invoiceNumber =0
    if id == 0:
        new_invoiceNumber = getActiveInvoices(request.user.id).count() + 1
    return render(request, 'invoice_edit.html', {"invoiceID": id,'new_invoiceNumber': new_invoiceNumber })

@login_required
def InvoiceDownload (request,id=0):
   return renderInvoiceDetail(request,id,True)

@login_required
def InvoiceView (request,id=0):
    return  renderInvoiceDetail(request,id,False)

def renderInvoiceDetail(request,id,download ):
    invoice_data = Invoice.objects.filter(id=id, is_active=True, created_by=request.user.id)

    invoice_object = invoice_data[0]
    invoice_items = InvoiceItem.objects.filter(invoice_id=invoice_object.id)
    fileName = 'invoice_' + invoice_object.invoice_number + '.pdf'
    baseTemplate ='base.html'

    if download:
        baseTemplate = 'download_base.html'
    data = {
        'invoice': invoice_object,
        'invoice_items': list(invoice_items),
        'download':download,
        'baseTemplate': baseTemplate
    }

    if download:
        return render_to_pdf('download_invoice.html', fileName, data)
    else:
        return render(request, 'download_invoice.html', {'data': data})



def render_to_pdf(template_src,fileName, data={}):
    template = get_template(template_src)
    html = template.render({'data': data})


    path_wkhtmltopdf = r'C:\Program Files (x86)\wkhtmltopdf\bin\wkhtmltopdf.exe'
    config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)
    pdf = pdfkit.from_string(html, False,configuration=config)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="' + fileName + '"'

    return response