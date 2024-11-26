var mqtt = require("mqtt");
// import { useRouter } from "next/navigation";

var options = {
  protocol: "ws",
  // username: 'admin',
  // password: 'instar',
  clientId: "react-mqtt-app_" + Math.random().toString(16),
};


let client 


export default function Home() {
  // const router = useRouter();
  
  if (!client) client = mqtt.connect("ws://127.0.0.1:9001", options);

  let msg;
  client.on("connect", function () {
    console.log("connected!");
    
    client.subscribe("hive/debug");
    client.subscribe("hive/masters/00:15:5d:10:23:06/logs");

    client.on("message", async function (topic, message) {
      var note = message.toString();
      msg = note;
      console.log("got:", note);
      
      // router.refresh();
    });
  });

  // function MyButton({ value }) {
  //   function handleClick() {
  //     console.log("Clicked!");
  //     client.publish("hive/debug", JSON.stringify({ data: "Debug" }));
  //   }
  //   return <button onClick={handleClick}>{value}</button>;
  // }

  function Test({test}) {
    return (<p>{test}</p>)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Push Control on Click!</h1>
        <p>{msg}</p>
        <Test test={msg}></Test>
      </header>
    </div>
  );
}
