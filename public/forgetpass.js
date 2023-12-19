async function resetpass(event){
    event.preventDefault();
    try {
        const email = document.getElementById('email').value;
        console.log(email);
        let res = await axios.post(`http://localhost:3000/password/forgotpassword`, {email: email});
        if(res.status === 200) {
            confirm(`${res.data.message}`);
            window.location.href = '/user/login';
        }
    } catch (error) {
        console.log(error);
    }
}