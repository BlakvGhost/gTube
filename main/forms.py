from django import forms


class SearchForm(forms.Form):
    url = forms.CharField(widget=forms.URLInput(
        attrs={'class': 'form-control border-0', 'placeholder': "Entrer l'url: Ex https://youtu.be/MImG3sPBxEY"}),
        label=False, )
    # format = [('all', 'Tout'), ('video', 'Video'), ('audio', 'Audio')]
    # type = forms.CharField(widget=forms.Select(attrs={'class': 'form-select'}, choices=format))