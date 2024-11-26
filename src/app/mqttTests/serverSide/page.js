
import { Test } from "@components/Test";
import { getMQTTClient } from "@lib/mqtt/controlTest";
// import { MQQTpush } from "@lib/mqtt/controlTest";

export default async function Home() {
  // let node = "00:15:5d:ff:d6:4a";
  let top = "hive/slaves/553932323534160B12/sensors/Temperature/0b9ea4220ec0/telemetry"
  let messages = [];

  let client = getMQTTClient();
  console.log(client)
  // console.log(global._mqttClientPromise)

  const handleMessage = (topic, message) => {
    console.log("Server:", message.toString());
    messages.push(message.toString());
    console.log(messages.length)
  };

  client.on("message", handleMessage);
  client.subscribe(top);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Push Control on Click!</h1>
        <p>Instead of using a client-side client, lets try using functions to call a server-side client!</p>
        <p>We will use functions, callbacks and perhaps delegates to interact with the server.</p>
        <p>The server will be in charge of logic, i.e. security.</p>
        {/* {client ? <p>Client: {connected ? "Connected" : "Disconnected"}</p> : <p>No Client</p>} */}
        {/* {msg ? <p>{msg}</p> : <p>No message received</p>} */}
        <Test value={messages} />
        <p>{messages}</p>
      </header>
    </div>
  );
}


// {mySeparatedModules.map((moduleOfType, index) => (
//   <ModulesCard key={index} moduleOfType={moduleOfType} records={records} />
// ))}


// function MyButton() {
//   function handleClick() {
//     console.log("Clicked!");
//     // MQQTpush("hive/debug", JSON.stringify({ data: new Date() }));
//     // client.
//   }
//   // return <button onClick={handleClick}>{value}</button>;
// }