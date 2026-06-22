'use client'

import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import { useState, useTransition } from "react";
import { useToastContext } from "@/context/toastContext/toastContext";
import { useRouter } from "next/navigation";
import { z } from "zod";
import CreateBlogAction from "@/hooks/serverAction/sverAction";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const postSchema = z.object({
  title: z.string(),
  body: z.string(),
  image: z.instanceof(File).optional()
});

type PostProps = z.infer<typeof postSchema>;

export default function CreateForm() {
  const [postProps, setPostProps] = useState<PostProps>({ title: '', body: '', image: undefined });
  const showError = postProps.body === '' || postProps.title === '';
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const Toast = useToastContext();
  if (!Toast) return null;

  const { handleClick, handleStatus, handleError } = Toast;

  async function handleSubmit() {
    if (showError) {
      handleStatus('error');
      handleError('Fill the title and body fields');
      handleClick();
      return;
    }

    try {
      startTransition(() => {
        CreateBlogAction(postProps)
          .then(() => {
            handleStatus('success');
            handleError('Creating Post Successfully');
            handleClick();
            router.push('/blog');
          })
          .catch((error) => {
            console.error(error);
            handleStatus('error');
            handleError('Failed to create post');
            handleClick();
          });
      });
    } catch (error) {
      console.error(error);
      handleStatus('error');
      handleError('Failed to create post');
      handleClick();
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: { xs: 2, sm: 3, md: 0 }
      }}>
        <Typography
          variant="h3"
          color='primary'
          sx={{ fontWeight: 700, fontSize: { xs: '24px', sm: '32px', md: '42px' }, textAlign: 'center' }}
        >
          Create Post
        </Typography>
        <Typography
          color='textDisabled'
          sx={{ fontSize: { xs: '13px', sm: '15px', md: '16px' }, textAlign: 'center' }}
        >
          Share your thoughts with the big world
        </Typography>

        <Card sx={{
          width: { xs: '100%', sm: '90%', md: '700px' },
          borderRadius: '16px',
          p: { xs: 2, sm: 2.5, md: 3 },
          m: 2
        }}>

          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '18px', sm: '20px', md: '24px' } }}>
            Create Blog Article
          </Typography>

          <Typography color='textDisabled' sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' }, mb: 1 }}>
            Create new blog article
          </Typography>

          <TextField
            value={postProps.title}
            onChange={(event) => setPostProps({ ...postProps, title: event.target.value })}
            sx={{ mb: 2, mt: 2 }}
            fullWidth
            label='Title'
            placeholder="Super cool title"
          />

          <TextField
            value={postProps.body}
            onChange={(event) => setPostProps({ ...postProps, body: event.target.value })}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
            label="Content"
            placeholder="Super cool blog content"
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
          >
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ fontSize: { xs: '13px', sm: '14px' } }}
            >
              Upload Image
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => setPostProps({ ...postProps, image: event.target.files?.[0] })}
                multiple
              />
            </Button>

            <Button
              variant="contained"
              sx={{ fontSize: { xs: '13px', sm: '14px' } }}
              onClick={() => setPostProps({ ...postProps, image: undefined })}
            >
              Remove Image
            </Button>

            <Typography
              sx={{
                borderRadius: '10px',
                p: 1,
                textAlign: 'center',
                fontSize: { xs: '13px', sm: '14px', md: '16px' },
                width: { xs: '100%', sm: '160px' },
                bgcolor: postProps.image === undefined ? '#912020' : '#049e04'
              }}
            >
              {postProps.image === undefined ? 'Not uploaded' : 'Uploaded'}
            </Typography>
          </Stack>

          <Button
            onClick={handleSubmit}
            fullWidth
            variant='contained'
            sx={{ mt: 3, fontSize: { xs: '14px', sm: '16px' }, py: { xs: 1, sm: 1.2 } }}
            disabled={isPending}
          >
            {isPending ? 'Creating...' : 'Create'}
          </Button>

        </Card>
      </Stack>
    </Box>
  );
}
