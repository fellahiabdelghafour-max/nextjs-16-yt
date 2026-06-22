/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import CustomizedSnackbars from "@/components/toast/toast";
import { useToastContext } from "@/context/toastContext/toastContext";
import { authClient } from "@/lib/auth-client";
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Button, Card, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material"
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

interface user{
    password:string,
    email:string
}



export default function SignUp(){

        const toast=useToastContext()
    if (!toast) return null
    const {handleClick,handleError,handleStatus}=toast;

    const [user, setUser]= useState<user>({
        password:'',
        email:''
    })
    const route=useRouter()
      // -i- password Items -i-
    const outlinedPasswordId = useId();

    const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
    // -o- password Items -o-
   const [isPending, startTransition]=useTransition()
    async function handleSubmit(){

    startTransition(async()=>{
       const {error}=await authClient.signIn.email({
            email:user.email,
            password:user.password
        });
        console.log(error)
                if(error){
                    handleError(error.message? error.message:( error.status===500 ? 'check your internet':''))
                    handleStatus('error')
                }
        else {
            handleError('Success LOGIN')
            handleStatus('success')
            route.push('/')

        }
        handleClick();        
    })

    }
    return(
        <Card sx={{display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'10px',height:'70vh',bgcolor:'background.paper',p:10,width:'70%'}}>
              <form>



                <FormControl sx={{
                     m: 1,
                      width: '25ch',
                      minWidth:'100%',
                      ml:2}} 
                variant="outlined"
                >
                        <InputLabel htmlFor={`${outlinedPasswordId}-input`} >Password</InputLabel>
                        <OutlinedInput
                            value={user.password}
                            onChange={(event)=>
                            {
                                setUser({...user,password:event.target.value})
                            }
                            }
                            id={`${outlinedPasswordId}-input`}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end"   >
                                <IconButton
                                aria-label={
                                    showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={handleClickShowPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Password"
                        />
                </FormControl>
               
                <TextField 
                        value={user.email}
                        fullWidth 
                        sx={{m:2}} 
                        label='email' 
                        placeholder="write your email"
                        onChange={(event)=>{
                            setUser({...user,email:event.target.value})
                        }}
                        />
                <Button variant="contained" onClick={handleSubmit} loading={isPending} loadingPosition="start">Sign UP</Button>

              </form>
             <CustomizedSnackbars/>
        </Card>
    )
}