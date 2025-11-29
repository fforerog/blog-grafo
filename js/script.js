/**
 * BLOG TÉCNICO DE GRAFOS - JavaScript Principal
 * Funcionalidades interactivas del blog
 */

// ============================================================================
// UTILIDADES GENERALES
// ============================================================================

/**
 * Espera un tiempo específico (promesa)
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene parámetros de la URL
 */
function getUrlParameter(name) {
    const url = new URL(window.location);
    return url.searchParams.get(name);
}

/**
 * Resalta código en bloques <pre><code>
 */
function highlightCode() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // Intenta usar Prism si está disponible, de lo contrario usa formato simple
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(block);
        }
    });
}

/**
 * Agrega números de línea a los bloques de código
 */
function addLineNumbers() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const lines = block.textContent.split('\n');
        const numberedLines = lines
            .map((line, index) => `<span class="line-number">${index + 1}</span>${line}`)
            .join('\n');
        block.innerHTML = numberedLines;
    });
}

// ============================================================================
// INTERACTIVIDAD DE GRAFOS (PARA DEMOS)
// ============================================================================

/**
 * Clase para simular un Grafo en JavaScript
 */
class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }

    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    addEdge(vertex1, vertex2, directed = false) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);
        
        this.adjacencyList.get(vertex1).push(vertex2);
        
        if (!directed) {
            this.adjacencyList.get(vertex2).push(vertex1);
        }
    }

    /**
     * Búsqueda en Amplitud (BFS)
     */
    bfs(start) {
        const visited = new Set();
        const queue = [start];
        const result = [];

        while (queue.length > 0) {
            const vertex = queue.shift();

            if (!visited.has(vertex)) {
                visited.add(vertex);
                result.push(vertex);

                const neighbors = this.adjacencyList.get(vertex) || [];
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        queue.push(neighbor);
                    }
                }
            }
        }

        return result;
    }

    /**
     * Búsqueda en Profundidad (DFS) - Recursivo
     */
    dfs(start) {
        const visited = new Set();
        const result = [];

        const dfsHelper = (vertex) => {
            visited.add(vertex);
            result.push(vertex);

            const neighbors = this.adjacencyList.get(vertex) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    dfsHelper(neighbor);
                }
            }
        };

        dfsHelper(start);
        return result;
    }

    /**
     * Obtiene la representación como lista de adyacencia
     */
    getAdjacencyList() {
        let representation = '';
        for (const [vertex, neighbors] of this.adjacencyList) {
            representation += `${vertex}: [${neighbors.join(', ')}]\n`;
        }
        return representation;
    }

    /**
     * Obtiene la representación como matriz de adyacencia
     */
    getAdjacencyMatrix() {
        const vertices = Array.from(this.adjacencyList.keys()).sort();
        const size = vertices.length;
        const matrix = Array(size).fill(null).map(() => Array(size).fill(0));

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const vertex1 = vertices[i];
                const vertex2 = vertices[j];
                
                if (this.adjacencyList.get(vertex1).includes(vertex2)) {
                    matrix[i][j] = 1;
                }
            }
        }

        return { matrix, vertices };
    }
}

// ============================================================================
// FUNCIONES DE ANIMACIÓN
// ============================================================================

/**
 * Anima el desplazamiento suave a un elemento
 */
function smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Agrega un efecto de fade-in a los elementos
 */
function fadeInElements(selector = '.fade-in') {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.5s ease-in';
            setTimeout(() => {
                element.style.opacity = '1';
            }, 10);
        }, index * 100);
    });
}

/**
 * Resalta un elemento brevemente
 */
function highlightElement(element) {
    const originalBg = element.style.backgroundColor;
    element.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
    setTimeout(() => {
        element.style.backgroundColor = originalBg;
    }, 1500);
}

// ============================================================================
// TABLA DE CONTENIDOS DINÁMICA
// ============================================================================

/**
 * Genera una tabla de contenidos basada en los headers
 */
function generateTableOfContents() {
    const article = document.querySelector('article');
    if (!article) return;

    const headers = article.querySelectorAll('h2, h3');
    if (headers.length === 0) return;

    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>Tabla de Contenidos</h3><ul></ul>';

    const list = toc.querySelector('ul');

    headers.forEach((header, index) => {
        const id = `section-${index}`;
        header.id = id;

        const li = document.createElement('li');
        li.className = header.tagName.toLowerCase();
        li.innerHTML = `<a href="#${id}">${header.textContent}</a>`;
        list.appendChild(li);
    });

   // 🔥 Insertar la tabla inmediatamente DESPUÉS del H1 del artículo
const title = article.querySelector('.hero h1');

if (title) {
    title.parentNode.insertAdjacentElement("afterend", toc);
} else {
    // fallback si falla
    article.insertBefore(toc, article.firstChild);
}
}


// ============================================================================
// BÚSQUEDA EN EL BLOG
// ============================================================================

/**
 * Búsqueda simple de contenido
 */
function searchBlog(query) {
    if (query.length < 2) return;

    const content = document.querySelector('article');
    if (!content) return;

    const text = content.textContent.toLowerCase();
    const queryLower = query.toLowerCase();

    if (text.includes(queryLower)) {
        console.log(`Se encontraron coincidencias para: "${query}"`);
        // Aquí se podría agregar lógica adicional
    }
}

// ============================================================================
// COMPARTIR EN REDES SOCIALES
// ============================================================================

/**
 * Genera URLs de compartir para redes sociales
 */
function shareOnSocial(platform) {
    const url = window.location.href;
    const title = document.querySelector('article h1')?.textContent || 'Blog de Grafos';
    const text = `Echa un vistazo a: ${title}`;

    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// ============================================================================
// INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog de Grafos cargado correctamente');

    // Resaltar código
    highlightCode();

    // Generar tabla de contenidos si existe
    setTimeout(generateTableOfContents, 100);

    // Agregar botones de copiar a código
    addCopyCodeButtons();

    // Animar elementos al cargar
    fadeInElements('.fade-in');

    // Manejar clics en links internos
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            smoothScroll(id);
        });
    });
});

// ============================================================================
// THEME TOGGLE (Opcional para futuras mejoras)
// ============================================================================

/**
 * Función para cambiar tema (claro/oscuro)
 * Puede ser implementada en el futuro
 */
function toggleTheme() {
    const htmlElement = document.documentElement;
    htmlElement.style.colorScheme = htmlElement.style.colorScheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', htmlElement.style.colorScheme);
}

// ============================================================================
// EXPORTAR PARA MÓDULOS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Graph, sleep, getUrlParameter, highlightCode };
}
