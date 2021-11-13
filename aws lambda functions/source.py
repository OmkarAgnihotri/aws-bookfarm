import requests
import os
import json
import boto3

S3Client = boto3.client('s3', region_name = 'ap-south-1')

def send_email_for_verification(event, context):
    email = event['email']
    url = event['url']
    
    response = requests.post(
		os.environ.get('mailgunURL'),
	    auth=("api", os.environ.get('API_KEY')),
		data={"from": "no-reply<bookfarm.tech>",
			"to": email,
			"subject": 'Email Verification',
			"text": "Follow the link to verify your email. {}".format(url)})
    
    print(response)

    
    
def send_password_reset_email(event, context):
    email = event['email']
    password = event['password']
    
    data = {
        "from" : "no-reply<bookfarm.tech>",
        "to" : email,
        "subject" : "Password Reset",
        "text" : (
            "Your Password has been reset. Login using the following password\\n"
            "New Password : "+password+"\\n"
            "We recommend you to change your password immediately after logging In."
        )
    }
    
    response = requests.post(
		os.environ.get('mailgunURL'),
	    auth=("api", os.environ.get('API_KEY')),
		data=data
    )
    
    print(response)
    
def get_signed_url(event, context):
    data = json.loads(event['body'])
    response = S3Client.generate_presigned_post(
        data['bucketName'],
        data['filePath'],
        Fields = {
            'Metadata' : {
                'userId' : data['filePath'].split('/')[0]
            }
        },
        ExpiresIn = 3600
    )
    
    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {"Content-Type" : "application/json"},
        "body": json.dumps({
            "url" : response
        })
    }
    
if __name__ == '__main__':
    pass