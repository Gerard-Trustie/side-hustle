"server only";

import {
  LambdaClient,
  InvokeCommand,
  InvokeCommandInput,
} from "@aws-sdk/client-lambda";

export async function invokeLambdaFunction(
  lambdaName: string,
  payload: object | undefined
) {
  try {
    const lambdaClient = new LambdaClient({});
    const invokeParams: InvokeCommandInput = {
      FunctionName: lambdaName,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(payload),
    };

    const { Payload } = await lambdaClient.send(
      new InvokeCommand(invokeParams)
    );

    const jsonString = Buffer.from(Payload).toString();
    const result = JSON.parse(jsonString);
    console.log("🚀 ~ result:", result);

    return result;
  } catch (error) {
    console.error("Error invoking lambda function:", error);
    throw error;
  }
}
