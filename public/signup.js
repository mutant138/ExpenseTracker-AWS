async function signup(e){
    try {
        e.preventDefault()
        // console.log(e.target.email.value)
        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        // console.log(signupDetails)
        const response = await axios.post('http://localhost:3000/user/signup', signupDetails)
        if (response.status >= 200 && response.status < 300) {
            window.location.href = "/user/login"
        } else {
            throw new Error('Failed to login')
        }
    } catch (error) {
        document.body.innerHTML += `<div style="color:red;">${error} <div>`;
    }
}