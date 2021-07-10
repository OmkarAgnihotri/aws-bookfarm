import boto3
import sys
import pprint

client = boto3.client('lambda')

def update_function(functionName):
    
    response = client.update_function_code(
        FunctionName = functionName,
        S3Bucket = 'bookfarm-project-code',
        S3Key = 'lambda-functions/lambda-source.zip'
    )
    
    pprint.pprint(response)
    
    
if __name__ == '__main__':
    functionName = sys.argv[1]
    print(functionName, type(functionName))
    update_function(functionName)
    
