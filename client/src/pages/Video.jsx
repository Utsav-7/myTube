import React, { useEffect, useState } from "react";
import styled from "styled-components";

import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import Comments from "../components/Comments";
import Comment from "../components/Comment";
import Card from "../components/Card";
import { useLoaderData, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchFailure, fetchStart, fetchSuccess, like, dislike } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";

import { format } from "timeago.js";
import { combineReducers } from "@reduxjs/toolkit";



const Container = styled.div`
    display:flex;
    gap:24px;
`
const Content = styled.div`

    flex:5;
`

const VideoWrapper = styled.div``


const Title = styled.h1`
    font-size:18px;
    font-weight: 400;
    margin-top: 2px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.text};

`

const Details = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Info = styled.div`
    color: ${({ theme }) => theme.textSoft};
`

const Buttons = styled.div`

    display: flex;
    gap: 20px;
    color: ${({ theme }) => theme.textSoft};
`

const Button = styled.div`

    display: flex;
    align-items: center;
    gap: 5px;
    cursor:pointer;
`
const Hr = styled.hr`
    margin: 15px 0px;
    border: 0.5px solid ${({ theme }) => theme.soft};
;
`

const Recommandation = styled.div`
    flex:2;
`
const Channel = styled.div`
    display: flex;
    justify-content: space-between;
`

const ChannelInfo = styled.div`

    display: flex;
    gap: 20px;
`

const Image = styled.img`

    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #999;
`

const ChannelDetails = styled.div`
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.text};

`

const ChannelDetail = styled.div``

const ChannelName = styled.span`
    font-weight: 500;
`

const ChannelCOunter = styled.span`
    margin-top: 5px;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.textSoft};
    font-size: 10px;

`

const ChannelDescription = styled.p`
    font-size: 12px;
`

const Subscribe = styled.button`
    background-color: red;
    font-weight: 500;
    color: white;
    border:none;
    border-radius: 3px;
    height: max-content;
    padding: 10px 20px;
    cursor: pointer;
`

const VideoFrame = styled.video`

    max-height:550px;
    width: 100%;
    object-fit: cover;
`

const Video = () => {

    const { currentUser } = useSelector((state) => state.user);
    const { currentVideo } = useSelector((state) => state.video);
    const dispatch = useDispatch();

    const path = useLocation().pathname.split("/")[2];

    console.log(path)

    const [channel, setChannel] = useState({});

    const handleLike = async () => {

        await axios.put(`${process.env.REACT_APP_BASE_URL}/auth/signup/users/like/${currentVideo._id}`)
        dispatch(like(currentUser._id))
    }

    const handleDisLike = async () => {

        await axios.put(`${process.env.REACT_APP_BASE_URL}/users/dislike/${currentVideo._id}`)
        dispatch(dislike(currentUser._id))
    }

    const handleSubscription = async () => {
        currentUser.subscribedUsers.includes(channel._id) ?
            await axios.put(`${process.env.REACT_APP_BASE_URL}/users/unsub/${channel._id}`) :
            await axios.put(`${process.env.REACT_APP_BASE_URL}/users/sub/${channel._id}`)

        dispatch(subscription(channel._id))
    }

    useEffect(() => {

        const fetchData = async () => {
            console.log("use effect called via fetchData")

            try {
                const videoRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/video/find/${path}`);
                const channelRes = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/users/find/${videoRes.data.userId}`
                );
                console.log(videoRes, channelRes)
                setChannel(channelRes.data);
                dispatch(fetchSuccess(videoRes.data));
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()

    }, [path, dispatch])

    return (
        <>
            <Container>
                <Content>
                    <VideoWrapper>
                        <VideoFrame src={currentVideo.videoUrl} controls />
                    </VideoWrapper>
                    <Title> {currentVideo.title} </Title>
                    <Details>
                        <Info>{currentVideo.views} views - {format(currentVideo.updatedAt)}</Info>
                        <Buttons>
                            <Button onClick={handleLike}>
                                {currentVideo.likes?.includes(currentUser._id) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />} {currentVideo.likes?.length}
                            </Button>
                            <Button onClick={handleDisLike}>
                                {currentVideo.dislikes?.includes(currentUser._id) ? <ThumbDownIcon /> : <ThumbDownOffAltOutlinedIcon />} {currentVideo.dislikes?.length}
                            </Button>
                            <Button>
                                <ReplyOutlinedIcon />
                                share
                            </Button>
                            <Button>
                                <AddTaskOutlinedIcon />
                                save
                            </Button>

                        </Buttons>
                    </Details>
                    <Hr />
                    <Channel>
                        <ChannelInfo>
                            <Image src="" />
                            <ChannelDetails>
                                <ChannelName>{channel.name}</ChannelName>
                                <ChannelCOunter>{channel.subscribers} Subscribers</ChannelCOunter>
                                <ChannelDescription>
                                    {currentVideo.desc}
                                </ChannelDescription>

                            </ChannelDetails>
                        </ChannelInfo>
                        <Subscribe onClick={handleSubscription}>{currentUser.subscribedUsers?.includes(currentUser._id) ? "SUBSCRIBED" : "SUBSCRIBE"}</Subscribe>
                    </Channel>
                    <Hr />
                    <Comments videoId={currentVideo._id} />
                </Content>
                {/*<Recommandation>
                <Card type="sm" />
                <Card type="sm" />
                <Card type="sm" />
                <Card type="sm" />
                <Card type="sm" />

    </Recommandation>*/}
            </Container>
        </>
    )

}

export default Video