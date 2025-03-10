// src/app/(private)/prispevok/[postId]/page.tsx

import Typography from '@mui/material/Typography';

export const metadata = {title:"Detailny zoznam prispevkov ZoskaSnap "};

export default function PostDetail({ params }: { params: { postId: string } }) {
  return (
    <Typography>Detailny zoznam prispevkov {params.postId}</Typography>
  );
}
