
import Sidebar from "./Sidebar.js";
import { initRouter, push } from "../util/route.js";
import { request } from "../util/api.js";
import DocumentList from "./DocumentList.js";
import Editor from "./Editor.js";

const SAVE_NOW_KEYS = ['Enter', '.', 'Tab', undefined];

export default function App({ $app }) {

  this.state = {
    documents: [],
    selectedDocument: {
      id: null,
      title: '',
      content: '',
      documents: []
    },
  };

  this.setState = (nextState) => {
    // TODO: Validate
    this.state = { ...nextState };
    const { documents, selectedDocument } = this.state;
    documentList.setState(documents);
    editor.setState(selectedDocument);
  }

  const sidebar = new Sidebar({
    $target: $app,
    onClickHeader: () => {
      push('/')
    },
    onClickAddButton: async () => {
      postDocumnet(null);
    }
  });

  const documentList = new DocumentList({
    $target: sidebar.getElement(),
    initialState: this.state.documents,
    onDocumentClick: async (id) => {
      push(`/documents/${id}`);
    },
    onAddSubDocumentButtonClick: (parentId) => {
      postDocumnet(Number(parentId));
    },
    onRemoveDocumentButtonClick: (id) => {
      deleteDocument(Number(id))
    }
  });

  let editorKeyupTimeoutId = null;

  const editor = new Editor({
    $target: $app,
    initialState: this.state.selectedDocument,
    onEdit: (document, key) => {
      const time = SAVE_NOW_KEYS.includes(key) ? 0 : 2000;

      if (editorKeyupTimeoutId !== null) {
        clearTimeout(editorKeyupTimeoutId);
      }

      editorKeyupTimeoutId = setTimeout(() => {
        const { id } = this.state.selectedDocument
        updateDocument(id, document);
        getDocuments();
      }, time);
    }
  });

  const getDocuments = async () => {
    const documents = await request('/documents');
    this.setState({ ...this.state, documents });
  };

  const postDocumnet = async (parent) => {
    const { id } = await request(`/documents`, {
      method: 'POST',
      body: JSON.stringify({ parent, title: '' })
    });
    push(`/documents/${id}`);
  }

  const updateDocument = async (id, document) => {
    await request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(document)
    });
  }

  const deleteDocument = async (id) => {
    await request(`/documents/${id}`, {
      method: 'DELETE'
    });
    getDocuments();
    if (this.state.selectedDocument.id === id) push('/');
  }

  const route = async () => {
    const { pathname } = window.location;
    if (pathname === '/') {
      this.setState({ ...this.state, selectedDocument: { ...this.state.selectedDocument, id: null } })
    } else if (pathname.indexOf('/documents/') === 0) {
      const [, , id] = pathname.split('/');
      const nextState = {}
      if (this.state.selectedDocument.id !== Number(id)) {
        nextState['selectedDocument'] = await request(`/documents/${id}`);
      }
      nextState['documents'] = await request('/documents');
      this.setState({ ...this.state, ...nextState });
    }
  }

  (() => {
    getDocuments();
    initRouter(() => route());
  })();
}