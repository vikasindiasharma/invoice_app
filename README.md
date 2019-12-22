# invoice_app
 
 Steps to run the server : 
 
 1.  Download the source code from : https://github.com/vikasindiasharma/invoice_app  
 2. Unzip Folser and open command promit and change your working directory to Unzipped folder location.
 3. You should be in folder where we have 'manage.py' to run  below steps.
 4. Create virtual enviornment using : virtualenv myVirtualenv ( Note you can give any name . I have just use myVirtualenv)
 5. Acticate Enviornmeht using myVirtualenv\Scripts\activate
 5. Install dependencies using : pip3 install -r requirements.txt
 6. If you want to support Facebook based login then update file  : timberbase\settings.py
      SOCIAL_AUTH_FACEBOOK_KEY = 'XXXXX'
     SOCIAL_AUTH_FACEBOOK_SECRET = 'XXXX'

7.  Please note if you are rumning locally then for facebook use http://localhost:8000/  instead of http://127.0.0.1:8000/

8.  Create super user, using command   manage.py createsuperuser . You need this to create new Clients. I have already created one user vikas , password vikas 

9. Please install wkhtmltopdf for PDF download to work. Download location : https://wkhtmltopdf.org/downloads.html. Once instaled please update the path of installation at : line no 61 of invoice/views.py file. 

   path_wkhtmltopdf = r'C:\Program Files (x86)\wkhtmltopdf\bin\wkhtmltopdf.exe'

10. Run http://localhost:8000/ to view site.


Assumptions : 

1. Client list is shared with all users .  I am redirecting to Admn portal for creating new client and user can neviage back using 'View site' option on Top right corner of Admin Portal.

2. Invoice are stored per user base. Each edit in invoice create new version.

3. No hard deleted of invoices .  Deleted invoices are marked as inactive. 

4.  Invoice number , issue date and versions are system generated. 
