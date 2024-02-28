import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios"
import { useDispatch } from "react-redux";
import { auth, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth";

import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
    font-size:22px;
`

const SubTitle = styled.h2`
    font-size:18px;
    weight:300;
`

const Input = styled.input`
    border:1px solid ${({ theme }) => theme.soft};
    border-radius:3px;  
    padding:10px;
    background-color:transparent;
    width:100%
`

const Button = styled.button`
    border-radius:3px;  
    border:none;
    padding:10px 20px;
    font-weight:500;
    cursor:pointer;
    background-color:${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.textSoft};

`
const More = styled.div`

    display:flex;
    margin-top:10px;
    font-size:10px;
    color:${({ theme }) => theme.textSoft};

`

const Links = styled.div`

    display:flex;
    margin-left:50px;

`

const Link = styled.div`

    margin-left:30px;
`



const SignIn = () => {

    const [userName, setUserName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const dispatch = useDispatch()

    const handleGoogleSignin = async () => {

        dispatch(loginStart())

        signInWithPopup(auth, provider).then((result) => {
            console.log(result)
            axios.post(`${process.env.REACT_APP_BASE_URL}/auth/google`, {
                name: result.user.displayName,
                email: result.user.email,
                img: result.user.photoURL
            }).then((result) => {
                dispatch(loginSuccess(result.data))
            })
        }).catch((err) => {
            console.error(err)
            dispatch(loginFailure())
        })
    }

    const handleSignIn = async (e) => {

        e.preventDefault()

        dispatch(loginStart())

        try {
            const signInRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/signin`, { "name": userName, password })

            console.log(signInRes.data)
            dispatch(loginSuccess(signInRes.data))
        }
        catch (err) {
            console.log(err)
            dispatch(loginFailure())
        }
    }

    const handleSignUp = async () => {

        const signInRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/signup`, { "name": userName, email, password })

        console.log(signInRes.data)

    }

    return (
        <>
            <Container>
                <Wrapper>
                    <Title>Sign in</Title>
                    <SubTitle>to continue to MyTube</SubTitle>
                    <Input placeholder="username" onChange={(e) => setUserName(e.target.value)} />
                    <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <Button onClick={handleSignIn}>Sign In</Button>

                    <Title>Or</Title>
                    <Button onClick={handleGoogleSignin}>SignIn with Google</Button>
                    <Title>Or</Title>

                    <Input placeholder="username" onChange={(e) => setUserName(e.target.value)} />
                    <Input placeholder="e-mail" onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <Button onClick={handleSignUp}>Sign Up</Button>
                </Wrapper>
                <More>
                    English(USA)
                    <Links>
                        <Link>Help</Link>
                        <Link>Privacy</Link>
                        <Link>Terms</Link>
                    </Links>
                </More>
            </Container>
        </>
    )

}

export default SignIn