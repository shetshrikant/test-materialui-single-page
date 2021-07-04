import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from "axios";
import Box from "@material-ui/core/Box";
import {List, ListItem} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const accordionItems = ['nginx', 'redis', 'memcached'];

export default function ActualTask() {
    const classes = useStyles();
    const [data, setData] = useState(null)
    const [loadingStatus, setLoadingStatus] = useState('loading')

    useEffect(() => {
        const productData = {};
        const fetchData = async () => {
            await Promise.all(
                accordionItems.map(async (item) => {
                    try {
                        let result = await axios.get(`http://localhost:3001/${item}`)
                        if (result) {
                            productData[item] = result.data
                        } else {
                            productData[item] = null
                        }
                    } catch (err) {
                        productData[item] = null
                    }
                })
            )

            if (productData) {
                setData(productData);
                setLoadingStatus('success')
                return true
            } else {
                setData(null);
                setLoadingStatus('failure')
                return true
            }
        }
        fetchData();
    }, []);

    const conditionalRendering = () => {
        if (loadingStatus === 'loading') {
            return <Box>Loading....</Box>
        } else if (loadingStatus === 'success') {
            return (<Box margin={4}>
                {accordionItems.map((tag, index) => {
                    return (
                        <Accordion key={index}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                            >
                                <Typography className={classes.heading} style={{textTransform:"capitalize"}}>{tag}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {data[tag] && data[tag]['results']
                                        ?
                                        (
                                            data[tag]['results'].map(
                                                (digestFamily, index) => {
                                                    return (
                                                        <ListItem key={index}>
                                                            <Typography>
                                                            {digestFamily['name']}
                                                            </Typography>
                                                        </ListItem>
                                                    )
                                                }
                                            )
                                        )
                                        :
                                        "Loading failed. Refresh page to retry. You can still checkout other products!"
                                    }
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>)
        } else {
            return <Box>Error occurred while loading data. Please refresh.</Box>
        }
    }

    return (
        <>
            <Typography variant='h4' style={{marginTop:12, marginLeft:8}}>Docker Image Tags</Typography>
            {conditionalRendering()}
        </>
    );
}