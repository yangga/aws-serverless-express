#!/usr/bin/env node
'use strict'
const fs = require('fs')
const args = process.argv.slice(2)
const accountId = args[0]
const bucketName = args[1]
const region = args[2] || 'us-east-1'
const product = args[3]
const availableRegions = ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2']

if (!accountId || accountId.length !== 12) {
    console.error('You must supply a 12 digit account id as the first argument')
    printParamSample()
    return
}

if (!bucketName) {
    console.error('You must supply a bucket name as the second argument')
    printParamSample()
    return
}

if (!product) {
    console.error('You must supply product name')
    printParamSample()
    return
}

if (availableRegions.indexOf(region) === -1) {
    console.error(`Amazon API Gateway and Lambda are not available in the ${region} region. Available regions: us-east-1, us-west-2, eu-west-1, eu-central-1, ap-northeast-1, ap-northeast-2, ap-southeast-1, ap-southeast-2`)
    return
}

modifySimpleProxyFile()
modifyPackageFile()
modifyCloudFormationFile()

function printParamSample() {
    console.error('param => [accountId] [bucketName] [region] [product]')
}

function modifySimpleProxyFile() {
    const simpleProxyApiPath = './simple-proxy-api.yaml'
    const simpleProxyApi = fs.readFileSync(simpleProxyApiPath, 'utf8')
    const simpleProxyApiModified = simpleProxyApi
        .replace(/YOUR_ACCOUNT_ID/g, accountId)
        .replace(/YOUR_AWS_REGION/g, region)
        .replace(/YOUR_PRODUCT_FUNCTION/g, product+'Func')
        .replace(/YOUR_PRODUCT_STACK/g, product+'Stack')
        .replace(/YOUR_PRODUCT_S3BUCKET/g, product+'S3Bucket')
        .replace(/YOUR_PRODUCT/g, product)

    fs.writeFileSync(simpleProxyApiPath, simpleProxyApiModified, 'utf8')
}

function modifyPackageFile() {
    const packageJsonPath = './package.json'
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8')
    const packageJsonModified = packageJson
        .replace(/YOUR_UNIQUE_BUCKET_NAME/g, bucketName)
        .replace(/YOUR_AWS_REGION/g, region)
        .replace(/YOUR_PRODUCT_FUNCTION/g, product+'Func')
        .replace(/YOUR_PRODUCT_STACK/g, product+'Stack')
        .replace(/YOUR_PRODUCT_S3BUCKET/g, product+'S3Bucket')
        .replace(/YOUR_PRODUCT/g, product)

    fs.writeFileSync(packageJsonPath, packageJsonModified, 'utf8')
}

function modifyCloudFormationFile() {
    const filePath = './cloudformation.json'
    const f = fs.readFileSync(packageJsonPath, 'utf8')
    const fModified = f
        .replace(/YOUR_UNIQUE_BUCKET_NAME/g, bucketName)
        .replace(/YOUR_AWS_REGION/g, region)
        .replace(/YOUR_PRODUCT_FUNCTION/g, product+'Func')
        .replace(/YOUR_PRODUCT_STACK/g, product+'Stack')
        .replace(/YOUR_PRODUCT_S3BUCKET/g, product+'S3Bucket')
        .replace(/YOUR_PRODUCT/g, product)

    fs.writeFileSync(filePath, fModified, 'utf8')
}
