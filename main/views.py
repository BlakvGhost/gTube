from django.shortcuts import render
from django.http import JsonResponse

from pytube import YouTube

from .forms import SearchForm


def index(request):
    context = {'form': SearchForm}
    return render(request, 'home.html', context)


def looking_video(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=200)

    form = SearchForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'error': 'Invalid form data'}, status=200)

    url = form.cleaned_data.get('url')
    try:
        yt = YouTube(url)
    except Exception:
        return JsonResponse({'error': 'Invalid YouTube URL'}, status=200)

    streams = []
    for stream in yt.streams:
        file_size = stream.filesize
        if file_size is not None:
            file_size = f'{round(int(file_size) / 1000000, 2)} Mo'

        resolution = 'Audio'
        if stream.resolution is not None:
            resolution = stream.resolution

        streams.append({
            'resolution': resolution,
            'extension': stream.subtype,
            'file_size': file_size,
            'video_url': stream.url
        })
    streams = streams[::-1]

    data = {
        'title': yt.title, 'streams': streams,
        'description': yt.description,
        'thumb': yt.thumbnail_url,
        'duration': round(int(yt.length) / 60, 2), 'views': f'{int(yt.views):,}'
    }
    return JsonResponse(data)