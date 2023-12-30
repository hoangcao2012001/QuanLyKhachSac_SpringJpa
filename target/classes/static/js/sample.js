
const list = document.getElementById("list")
getData();
async function getData(){
	const reapi =await fetch('http://localhost:8081/users')
  const data = await reapi.json();
  console.log('data :>> ',data);
}