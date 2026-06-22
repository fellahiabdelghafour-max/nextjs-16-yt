'use client'

import { api } from "@/../convex/_generated/api";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { Id } from "../../../convex/_generated/dataModel";
import { Box, Typography } from "@mui/material";

interface presenceProps {
     roomId:Id<'Posts'>,
     userId:string,
     userName:string,
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default  function PresenceComponent({roomId,userId,userName}:presenceProps): React.ReactElement {
  const presenceState = usePresence(api.presence,roomId,userName);

  return (
    <Box sx={{color:'black'}}>
       <Typography sx={{color:'text.primary',fontSize:'25px',fontWeight:'300'}}>
          viewing now:
       </Typography>

      <FacePile presenceState={presenceState ?? []} />
    </Box>
  );
}