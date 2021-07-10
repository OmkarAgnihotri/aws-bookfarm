import boto3

client = boto3.client('lambda')

def lambda_send_verification_email():
    output = client.create_function(
        FunctionName = 'send_email_for_verification',
        Runtime = 'python3.8',
        Handler = 'source.send_email_for_verification',
        Role = 'arn:aws:iam::838807621753:role/allowLogging',
        Code = {
            'S3Bucket' : 'bookfarm-project-code',
            'S3Key' : 'lambda-functions/lambda-source.zip'
        },
        Description = 'This function sends verification email once user has signedup',
        Timeout = 60,
        
    )
    
    print(output)
    
def lambda_send_password_reset_email():
    output = client.create_function(
        FunctionName = 'send_password_reset_email',
        Runtime = 'python3.8',
        Handler = 'source.send_password_reset_email',
        Role = 'arn:aws:iam::838807621753:role/allowLogging',
        Code = {
            'S3Bucket' : 'bookfarm-project-code',
            'S3Key' : 'lambda-functions/lambda-source.zip'
        },
        Description = 'This function sends email to reset password',
        Timeout = 60
        
    )
    
    print(output)
    

def lambda_get_signed_url():
    output = client.create_function(
        FunctionName = 'get_signed_url',
        Runtime = 'python3.8',
        Handler = 'source.get_signed_url',
        Role = 'arn:aws:iam::838807621753:role/lambdaGetSignedUrl',
        Code = {
            'S3Bucket' : 'bookfarm-project-code',
            'S3Key' : 'lambda-functions/lambda-source.zip'
        },
        Description = 'Gets signed URL for image upload.',
        Timeout = 60
        
    )
    
    print(output)
    
    
lambda_get_signed_url()
    
