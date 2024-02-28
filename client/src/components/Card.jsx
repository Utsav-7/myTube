import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {Link, useLocation} from "react-router-dom"
import {format} from "timeago.js"

import axios from "axios";

const Container = styled.div`

    width: ${(props)=> props.type !== "sm" && "330px"};
    margin-bottom: ${(props)=> props.type === "sm" ? "10px":"45px"};;
    cursor: pointer;
    display: ${(props)=> props.type === "sm" && "flex"};
    gap:10px;
`

const Image = styled.img`

    width: 100%;
    height: ${(props)=> props.type === "sm" ? "120px":"202px"};
    background-color: #999;
    flex: 1;

`

const Details = styled.div`
    display: flex;
    margin-top: ${(props)=> props.type !== "sm" && "16px"};
    gap: 12px;
    flex: 1;
`

const ChannelImage = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
    display: ${(props)=> props.type === "sm" && "none"};
`

const Texts = styled.div``

const Title = styled.h1`

    font-size: 14px;
    font-weight: 500;
    color: ${({theme})=> theme.text};
`

const ChannelName = styled.h2`
    font-size: 12px;
    color: ${({theme})=> theme.testSoft};
    margin: 9px 0px;
`

const Info = styled.div`
    font-size:12px;
    color: ${({theme})=> theme.text};
`


const Card = ({type,video})=>
{

    const [channelName,setChannelName] = useState()

    useEffect(()=>{

        const getChannelName = async ()=>{

         const channel = await axios.get(`/users/find/${video.userId}`)
         //console.log(channel.data.name)
         setChannelName(channel.data.name)
        }

        getChannelName()

    },[video])

    return(
        <>
        <Link to={`video/${video._id}`} style={{textDecoration:"none",color:'inherit'}}>
        <Container type={type}>
            <Image src={video.imgUrl} />
            <Details>
                <ChannelImage type={type} />
                <Texts>
                    <Title>
                        {video.title}
                    </Title>
                    <ChannelName>
                        {channelName}
                    </ChannelName>
                    <Info>
                            {video.views} • {format(video.updatedAt)}
                    </Info>
                </Texts>
            </Details>
        </Container>
        </Link>
        </>
    )

}

export default Card