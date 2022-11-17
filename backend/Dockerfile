# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt

COPY . .

# Install psycop2 dependencies
RUN apt-get update \
    && apt-get -y install cron \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

RUN pip3 install -r requirements.txt

CMD cron 