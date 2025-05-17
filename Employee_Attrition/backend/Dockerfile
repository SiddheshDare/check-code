FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Create log directory
RUN mkdir -p /app/log && \
    touch /app/log/training.log /app/log/prediction.log && \
    chmod -R 777 /app/log

EXPOSE 8001

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
