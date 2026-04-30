const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const editor = document.getElementById('editor');
const originalPreview = document.getElementById('original-preview');
const compressedPreview = document.getElementById('compressed-preview');
const qualitySlider = document.getElementById('quality-slider');
const qualityVal = document.getElementById('quality-val');
const downloadBtn = document.getElementById('download-btn');

let currentFile = null;

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        processFile(e.target.files[0]);
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
    }
});

function processFile(file) {
    if (!file.type.match('image/jpeg')) {
        alert('Please select a JPEG image.');
        return;
    }
    currentFile = file;
    document.getElementById('original-size').textContent = formatSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        compressImage();
        editor.classList.remove('hidden');
        dropZone.classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function compressImage() {
    const quality = qualitySlider.value / 100;
    qualityVal.textContent = qualitySlider.value;

    const img = new Image();
    img.src = originalPreview.src;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
            compressedPreview.src = URL.createObjectURL(blob);
            document.getElementById('compressed-size').textContent = formatSize(blob.size);
            
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = compressedPreview.src;
                link.download = `optimized-${currentFile.name}`;
                link.click();
            };
        }, 'image/jpeg', quality);
    };
}

qualitySlider.addEventListener('input', compressImage);

function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
