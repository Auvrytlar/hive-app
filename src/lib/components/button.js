
export function MyButton({ client, value }) {
  function handleClick() {
    console.log("Clicked!");
    client.publish("hive/debug", JSON.stringify({ data: "Debug" }));
  }
  return <button onClick={handleClick}>{value}</button>;
}