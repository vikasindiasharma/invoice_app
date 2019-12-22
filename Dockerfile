FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /timberbase
WORKDIR /timberbase
COPY requirements.txt /timberbase/
RUN pip3 install -r requirements.txt
COPY . /timberbase/