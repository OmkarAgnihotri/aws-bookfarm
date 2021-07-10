import boto3
import time
import json

client = boto3.client('lambda', region_name = 'ap-south-1')

def send_verification_email(email, token):
    
    url = 'http://127.0.0.1:8000/auth/verify-email/?token={}'.format(token)
    
    event = {'email' : email,'url' : url}
    
    payload = bytes(json.dumps(event), 'utf-8')
    
    start_time = time.time()
    response = client.invoke(
        FunctionName = 'send_email_for_verification',
        InvocationType = 'Event',
        LogType = 'Tail',
        Payload = payload
    )
    
    print(response)
    
def send_password_reset_email(email, password):
    event = {'email' : email,'password' : password}
    
    payload = bytes(json.dumps(event), 'utf-8')
    
    start_time = time.time()
    response = client.invoke(
        FunctionName = 'send_password_reset_email',
        InvocationType = 'Event',
        LogType = 'Tail',
        Payload = payload
    )
    
    print(response)