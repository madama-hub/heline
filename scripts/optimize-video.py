from pathlib import Path
import hashlib, json, subprocess, sys, shutil

sys.path.insert(0, str(Path('.tools').resolve()))
import imageio_ffmpeg

source = Path('media/video-original.mp4')
if not source.exists():
    source = Path('../video 1.mp4')
source = source.resolve()
target = Path('dist/assets/hero-web.mp4').resolve()
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source), '-vf', 'scale=1600:-2', '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-an', '-movflags', '+faststart', str(target)], check=True)
def checksum(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()
metadata = {'source_file': source.name, 'source_sha256': checksum(source), 'web_file': 'hero.mp4', 'web_sha256': checksum(target), 'source_bytes': source.stat().st_size, 'web_bytes': target.stat().st_size}
Path('dist/assets/video-provenance.json').write_text(json.dumps(metadata, indent=2), encoding='utf8')
shutil.copyfile(target, Path('dist/assets/hero.mp4'))
target.unlink()
print(json.dumps({'original_bytes': metadata['source_bytes'], 'web_bytes': metadata['web_bytes'], 'reduction_percent': round(100*(1-metadata['web_bytes']/metadata['source_bytes']))}))
