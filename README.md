# TIME IS A LIE

Or... is it?

## Details

Font used: [Hack](https://sourcefoundry.org/hack/)
FFmpeg command used: `ffmpeg -y -r 60 -i frame-%06d.png -c:a aac -b:a 256k -ar 44100 -c:v libx264 -pix_fmt yuv420p -r 60 video_h264.mp4`
