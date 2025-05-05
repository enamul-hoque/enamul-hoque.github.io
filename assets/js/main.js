// Download Resume when ref=emran
window.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);

    if (params.get('ref') === 'emran') {
        const link = document.createElement('a');

        link.href = 'assets/pdf/Resume - Enamul Hoque Mohon.pdf';
        // link.download = 'Resume - Enamul Hoque Mohon.pdf';

        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
    }
});
