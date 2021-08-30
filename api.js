const db = require("./db");
const uuid = require('uuid')
const {
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getOneLead = async (event) => {
  const response = { statusCode: 200 };

  try {
      const params = {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Key: marshall({ leadId: event.pathParameters.leadId }),
      };
      const { Item } = await db.send(new GetItemCommand(params));

      console.log({ Item });
      response.body = JSON.stringify({
          message: "Successfully retrieved lead.",
          data: (Item) ? unmarshall(Item) : {},
          rawData: Item,
      });
  } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
          message: "Failed to get lead.",
          errorMsg: e.message,
          errorStack: e.stack,
      });
  }

  return response;
}

const getOneLeadByEmail = async (event) => {
  const response = { statusCode: 200 };

  try {
      const params = {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Key: marshall({ email: event.pathParameters.email }),
      };
      const { Item } = await db.send(new GetItemCommand(params));

      console.log({ Item });
      response.body = JSON.stringify({
          message: "Successfully retrieved lead.",
          data: (Item) ? unmarshall(Item) : {},
          rawData: Item,
      });
  } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
          message: "Failed to get lead.",
          errorMsg: e.message,
          errorStack: e.stack,
      });
  }

  return response;
}

const getAllLeads = async () => {
  const response = { statusCode: 200 };

  try {
      const { Items } = await db.send(new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME }));

      response.body = JSON.stringify({
          message: "Successfully retrieved all leads.",
          data: Items.map((item) => unmarshall(item)),
          Items,
      });
  } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
          message: "Failed to retrieve leads.",
          errorMsg: e.message,
          errorStack: e.stack,
      });
  }

  return response;
};

const createOneLead = async (event) => {
  const response = { statusCode: 200 };

  try {
      const body = JSON.parse(event.body);

      const newLead = {
        ...body,
        leadId: uuid.v4()
      }
      console.log(newLead);

      const params = {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Item: marshall(newLead || {}),
      };
      const createResult = await db.send(new PutItemCommand(params));

      response.body = JSON.stringify({
          message: "Successfully created lead.",
          createResult,
      });
  } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
          message: "Failed to create lead.",
          errorMsg: e.message,
          errorStack: e.stack,
      });
  }
  console.log(response)
  return response;
};

const updateOneLead = async (event) => {
  const response = { statusCode: 200 };

  try {
      const body = JSON.parse(event.body);
      const objKeys = Object.keys(body);
      const params = {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Key: marshall({ leadId: event.pathParameters.leadId }),
          UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
          ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
              ...acc,
              [`#key${index}`]: key,
          }), {}),
          ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
              ...acc,
              [`:value${index}`]: body[key],
          }), {})),
      };
      const updateResult = await db.send(new UpdateItemCommand(params));

      response.body = JSON.stringify({
          message: "Successfully updated lead.",
          updateResult,
      });
  } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
          message: "Failed to update lead.",
          errorMsg: e.message,
          errorStack: e.stack,
      });
  }

  return response;
};

const deleteOneLead = async (event) => {
  const response = { statusCode: 200 };

  try {
      const params = {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Key: marshall({ leadId: event.pathParameters.leadId }),
      };
      const deleteResult = await db.send(new DeleteItemCommand(params));

      response.body = JSON.stringify({
          message: "Successfully deleted lead.",
          deleteResult,
      });
  } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
          message: "Failed to delete lead.",
          errorMsg: e.message,
          errorStack: e.stack,
      });
  }

  return response;
};

module.exports = {
  getOneLead,
  getOneLeadByEmail,
  getAllLeads,
  createOneLead,
  updateOneLead,
  deleteOneLead
}