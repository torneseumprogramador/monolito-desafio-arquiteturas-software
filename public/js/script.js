// Scripts personalizados para o Sistema de Produtos

// Função para confirmar exclusão de produtos
function confirmarExclusao(id, nome) {
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    document.getElementById('produtoNome').textContent = nome;
    document.getElementById('deleteForm').action = `/produtos/${id}/delete`;
    modal.show();
}

// Função para formatar preços
function formatarPreco(preco) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(preco);
}

// Função para formatar datas
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Auto-hide para alertas
document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Formatação de preços nos inputs
    const precoInputs = document.querySelectorAll('input[name="preco"]');
    precoInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                const valor = parseFloat(this.value);
                if (!isNaN(valor)) {
                    this.value = valor.toFixed(2);
                }
            }
        });
    });

    // Validação de formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        console.log('Form encontrado!', form);
        form.addEventListener('submit', function(e) {
            console.log('Form submit disparado!', this);
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    });

    // Tooltip initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Loading states for buttons
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.form && this.form.checkValidity()) {
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';
                setTimeout(() => {
                    this.disabled = true;
                }, 1000);
            }
        });
    });
});

// Função para buscar produtos com debounce
let searchTimeout;
function buscarProdutos(termo) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (termo.length >= 2) {
            window.location.href = `/produtos/search?q=${encodeURIComponent(termo)}`;
        }
    }, 500);
}

// Função para limpar formulários
function limparFormulario(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
    }
}

// Função para copiar texto para clipboard
function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        // Mostrar feedback visual
        const toast = document.createElement('div');
        toast.className = 'toast position-fixed top-0 end-0 m-3';
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">Copiado!</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                Texto copiado para a área de transferência.
            </div>
        `;
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    });
}

// Função para exportar dados (simulada)
function exportarDados() {
    // Aqui você pode implementar a exportação real
    alert('Funcionalidade de exportação será implementada em breve!');
}

// Função para imprimir página
function imprimirPagina() {
    window.print();
}

// Função para alternar tema (claro/escuro)
function alternarTema() {
    const body = document.body;
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// Carregar tema salvo
document.addEventListener('DOMContentLoaded', function() {
    const temaSalvo = localStorage.getItem('theme');
    if (temaSalvo === 'dark') {
        document.body.classList.add('dark-theme');
    }
}); 