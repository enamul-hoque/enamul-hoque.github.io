// Download Resume when ref=emran
const params = new URLSearchParams(window.location.search);

if (params.get('ref') === 'emran') {
    const link = document.createElement('a');

    // link.href = 'assets/pdf/Resume - Enamul Hoque Mohon.pdf';
    link.href = 'https://github.com/enamul-hoque';
    // link.download = 'Resume - Enamul Hoque Mohon.pdf';

    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
}
