document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('search');
    let page = 1;
    let searchQuery = '';

    async function loadImages() {
        const params = {
            per_page: 40,
            page,
        };

        if (searchQuery) {
            params.query = searchQuery;
        }

        try {
            const imagesData = await getStack(searchQuery ? 'search' : 'curated', params);

            if (imagesData) {
                renderImages(imagesData.photos);
                setupPagination(imagesData.total_results, page);
            } else {
                alert("Failed to load images.");
            }
        } catch (error) {
            console.error('Error loading images:', error);
            alert('An error occurred while loading images.');
        }
    }

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchQuery = searchInput.value.trim();
            page = 1;  
            loadImages();
        }
    });

    function renderImages(images) {
        const gallery = document.getElementById('image-gallery');
        gallery.innerHTML = '';  

        images.forEach((image, key) => {
            const imgElement = document.createElement('div');
            imgElement.classList.add('media-item');
            imgElement.dataset.key = key;
            imgElement.dataset.filename = image.src.medium.split('/').pop(); 

            imgElement.innerHTML = `
                <img src="${image.src.medium}" alt="${image.alt}">
                <div class="media-item-details-hover">
                    <div class="media-photographer text-truncate">By: ${image.photographer}</div>
                </div>
            `;
            
            gallery.appendChild(imgElement);

            imgElement.addEventListener('click', () => openPreview(image, key));
        });
    }

    function openPreview(image, key) {
        const modal = document.getElementById('media-preview');
        const previewMedia = document.getElementById('preview-media');
        const photographer = document.getElementById('phtotographer');
        const downloads = document.getElementById('downloads');

        previewMedia.innerHTML = `<img src="${image.src.large}" alt="${image.alt}">`;
        photographer.textContent = image.photographer;

        downloads.innerHTML = '';  
        const sizes = {
            original: "Original",
            large2x: "2x Larger",
            large: "Large",
            medium: "Medium",
            small: "Small",
            portrait: "Portrait",
            landscape: "Landscape",
            tiny: "Tiny"
        };

        for (const size in image.src) {
            const dlItem = document.createElement('a');
            dlItem.classList.add('btn', 'btn-sm', 'btn-primary', 'd-block', 'rounded-pill', 'mb-2');
            dlItem.href = image.src[size];
            dlItem.textContent = sizes[size];

            dlItem.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Downloading image from ${image.src[size]}`);
                downloadImg(image.src[size], image.src.medium.split('/').pop());
            });

            downloads.appendChild(dlItem);
        }

        const myModal = new bootstrap.Modal(modal);
        myModal.show();
    }

    function downloadImg(url, filename) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob(); // Convert to Blob
            })
            .then(blob => {
                // Create a download link
                const link = document.createElement('a');
                const mimeType = blob.type || 'image/jpeg'; 
                link.href = URL.createObjectURL(blob);
                link.download = `${filename}.${mimeType.split('/')[1]}`; 
                document.body.appendChild(link); 
                link.click(); 
                document.body.removeChild(link); 
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                alert('Failed to download the image.');
            });
    }
    

    function setupPagination(totalResults, currentPage) {
        const totalPages = Math.ceil(totalResults / 40);
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.textContent = 'Previous';
            prevBtn.addEventListener('click', () => {
                page--;
                loadImages();
            });
            pagination.appendChild(prevBtn);
        }

        pagination.innerHTML += `<span> Page ${currentPage} of ${totalPages} </span>`;

        if (currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Next';
            nextBtn.addEventListener('click', () => {
                page++;
                loadImages();
            });
            pagination.appendChild(nextBtn);
        }
    }

    loadImages();
});
