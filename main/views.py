from django.shortcuts import render
from django.http import JsonResponse
import re
import youtube_dl
from youtube_dl import DownloadError

from .forms import SearchForm


def index(request):
    context = {'form': SearchForm}
    return render(request, 'home.html', context)


def lookingVideo(request):
    regex = r'^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+'
    form = SearchForm(request.POST)
    if form.is_valid():
        url = form.cleaned_data.get('url')
        if not re.match(regex, url):
            return JsonResponse(False, safe=False)
        ydl_opts = {}

        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            try:
                meta = ydl.extract_info(url, download=False)
            except DownloadError:
                return JsonResponse(False, safe=False)
        video_audio_streams = []
        for m in meta['formats']:
            file_size = m['filesize']
            if file_size is not None:
                file_size = f'{round(int(file_size) / 1000000, 2)} Mo'

            resolution = 'Audio'
            if m['height'] is not None:
                resolution = f"{m['height']}x{m['width']}"
            video_audio_streams.append({
                'resolution': resolution,
                'extension': m['ext'],
                'file_size': file_size,
                'video_url': m['url']
            })
        video_audio_streams = video_audio_streams[::-1]
        data = {
            'title': meta['title'], 'streams': video_audio_streams,
            'description': meta['description'], 'likes': meta.get('like_count'),
            'thumb': meta['thumbnails'][3]['url'],
            'duration': round(int(meta['duration']) / 60, 2), 'views': f'{int(meta["view_count"]):,}'
        }
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse(False, safe=False)