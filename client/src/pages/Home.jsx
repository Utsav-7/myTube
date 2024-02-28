import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";

import axios from "axios"

const Container = styled.div`
    display:flex;
    justify-content: space-between;
    flex-wrap: wrap;
`

const Home = ({ type }) => {

    const [videos, setVideos] = useState([])
    const [err, setErr] = useState("")

    useEffect(() => {

        const fetchVideo = async () => {

            const videosRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/video/${type}`)

            //console.log("before ----------> ", videos)
            setVideos(videosRes.data)
            //console.log("after ----------> ", videos)

        }


        fetchVideo()

    }, [type])

    return (
        <>
            <Container>

                {videos.map((video) => (
                    <Card key={video._id} video={video} />
                ))}

            </Container>
        </>
    )

}

export default Home