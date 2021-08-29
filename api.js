const db = require("./db");
const {
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

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

const createLead = async (event) => {
  const response = { statusCode : 200 };

  try {

  } catch (e) {
    console.log(e);
    const body = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(body || {}),
    };

    const createResult = await db.send(new PutItemCommand(params));

    response.body = JSON.stringify({
      message: 'Succesfully created lead',
      createResult
    })
  }
}


module.exports = {
  getAllLeads,
  createLead
}