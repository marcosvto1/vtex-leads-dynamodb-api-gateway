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
    const { Items } = await db.send(new ScanCommand(
      {
        TableName: process.env.DYNAMODB_TABLE_NAME,
      }
    ))

    response.body = JSON.stringify({
      data: Items.map((item) => unmarshall(item)),
      Items,
    });

  } catch (e) {
    console.log(e);

    response.statusCode = 500;
    response.body = JSON.stringify({
      message: 'Failed to retrieve leads',
      errorMsg: e.message,
      errorStack: e.stack
    })

    return response;
  }
}

module.exports = {
  getAllLeads
}