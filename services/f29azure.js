'use strict'

const crypt = require('./crypt')
const config = require('../config')
const request = require('request')
const storage = require("@azure/storage-blob")
const accountBlobName = config.blobAccessToken.accountBlobName;
const keyAzureBlob = config.blobAccessToken.keyAzureBlob;
const sharedKeyCredentialGenomics = new storage.StorageSharedKeyCredential(accountBlobName,keyAzureBlob);
const blobServiceClientGenomics = new storage.BlobServiceClient(
    // When using AnonymousCredential, following url should include a valid SAS or support public access
    `https://${accountBlobName}.blob.core.windows.net`,
    sharedKeyCredentialGenomics
  );

var azure = require('azure-storage');

const User = require('../models/user')
const Patient = require('../models/patient')

var blobService = azure
      .createBlobService(accountBlobName,keyAzureBlob);


function getAzureBlobSasTokenWithContainer (req, res){
  var containerName = req.params.containerName;
  var category = config.translationCategory;
  var translationKey = config.translationKey;

  var startDate = new Date();
  var expiryDate = new Date();
  startDate.setTime(startDate.getTime() - 5*60*1000);
  expiryDate.setTime(expiryDate.getTime() + 24*60*60*1000);

  var containerSAS = storage.generateBlobSASQueryParameters({
      expiresOn : expiryDate,
      permissions: storage.ContainerSASPermissions.parse("rwdlac"),
      protocol: storage.SASProtocol.Https,
      containerName: containerName,
      startsOn: startDate,
      version:"2017-11-09"

    },sharedKeyCredentialGenomics).toString();
  res.status(200).send({containerSAS: containerSAS})
}

function getAzureBlobSasTokenRead (req, res){
  var containerName = req.params.containerName;
  var category = config.translationCategory;
  var translationKey = config.translationKey;

  var startDate = new Date();
  var expiryDate = new Date();
  startDate.setTime(startDate.getTime() - 5*60*1000);
  expiryDate.setTime(expiryDate.getTime() + 24*60*60*1000);

  var containerSAS = storage.generateBlobSASQueryParameters({
      expiresOn : expiryDate,
      permissions: storage.ContainerSASPermissions.parse("r"),
      protocol: storage.SASProtocol.Https,
      containerName: containerName,
      startsOn: startDate,
      version:"2017-11-09"

    },sharedKeyCredentialGenomics).toString();
  res.status(200).send({containerSAS: containerSAS})
}

 async function createContainers (containerName){
  // Create a container
  const containerClient = blobServiceClientGenomics.getContainerClient(containerName);

  const createContainerResponse = await containerClient.createIfNotExists();
  if(createContainerResponse.succeeded){
    return true;
  }else{
    return false;
  }


}

  async function downloadBlob(containerName, blobName){
    const containerClient = blobServiceClientGenomics.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = (
      await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
    ).toString();
    return downloaded;
  }

  async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
  }

module.exports = {
  getAzureBlobSasTokenWithContainer,
  getAzureBlobSasTokenRead,
  createContainers,
  downloadBlob
}
