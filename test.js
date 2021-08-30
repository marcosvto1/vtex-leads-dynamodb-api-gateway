const teste = {
  clientAt: "2021-08-29",
  prospectAt: "2021-08-29",
  email: "marcosvto2@gmail.com",
  phone: "64981032859",
  name: "Jose",
  type: "client"
}

const objKeys = Object.keys(teste);

const UpdateExpression = `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`

const ExpressionAttributeNames = objKeys.reduce((acc, key, index) => ({
  ...acc,
  [`#key${index}`]: key,
}), {});

console.log(ExpressionAttributeNames);