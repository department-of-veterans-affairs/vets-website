/**
 * @module tests/components/delete-modal/use-delete-modal.unit.spec
 * @description Unit tests for useDeleteModal hook
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { expect } from 'chai';
import sinon from 'sinon';
import { useDeleteModal } from './use-delete-modal';

describe('useDeleteModal', () => {
  describe('Initial State', () => {
    it('should initialize with modal closed', () => {
      const { result } = renderHook(() => useDeleteModal());

      expect(result.current.isModalOpen).to.be.false;
    });

    it('should initialize with null delete index', () => {
      const { result } = renderHook(() => useDeleteModal());

      expect(result.current.deleteIndex).to.be.null;
    });

    it('should provide all expected functions', () => {
      const { result } = renderHook(() => useDeleteModal());

      expect(result.current.handleModalCancel).to.be.a('function');
      expect(result.current.handleModalConfirm).to.be.a('function');
      expect(result.current.handleDeleteClick).to.be.a('function');
    });
  });

  describe('handleDeleteClick', () => {
    it('should open modal when handleDeleteClick is called', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.handleDeleteClick(0);
      });

      expect(result.current.isModalOpen).to.be.true;
    });

    it('should set delete index when handleDeleteClick is called', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.handleDeleteClick(2);
      });

      expect(result.current.deleteIndex).to.equal(2);
    });

    it('should not open modal if already open', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.handleDeleteClick(0);
      });

      const firstOpenState = result.current.isModalOpen;

      act(() => {
        result.current.handleDeleteClick(1);
      });

      expect(result.current.isModalOpen).to.equal(firstOpenState);
      expect(result.current.deleteIndex).to.equal(0);
    });
  });

  describe('handleModalCancel', () => {
    it('should close modal when handleModalCancel is called', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.handleDeleteClick(0);
      });

      expect(result.current.isModalOpen).to.be.true;

      act(() => {
        result.current.handleModalCancel();
      });

      expect(result.current.isModalOpen).to.be.false;
    });

    it('should reset delete index when handleModalCancel is called', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.handleDeleteClick(2);
      });

      expect(result.current.deleteIndex).to.equal(2);

      act(() => {
        result.current.handleModalCancel();
      });

      expect(result.current.deleteIndex).to.be.null;
    });
  });

  describe('handleModalConfirm', () => {
    it('should close modal when handleModalConfirm is called', () => {
      const onDelete = sinon.spy();
      const { result } = renderHook(() => useDeleteModal(onDelete));

      act(() => {
        result.current.handleDeleteClick(0);
      });

      expect(result.current.isModalOpen).to.be.true;

      act(() => {
        result.current.handleModalConfirm();
      });

      expect(result.current.isModalOpen).to.be.false;
    });

    it('should reset delete index when handleModalConfirm is called', () => {
      const onDelete = sinon.spy();
      const { result } = renderHook(() => useDeleteModal(onDelete));

      act(() => {
        result.current.handleDeleteClick(2);
      });

      expect(result.current.deleteIndex).to.equal(2);

      act(() => {
        result.current.handleModalConfirm();
      });

      expect(result.current.deleteIndex).to.be.null;
    });

    it('should call onDelete with delete index', done => {
      const onDelete = sinon.spy();
      const { result } = renderHook(() => useDeleteModal(onDelete));

      act(() => {
        result.current.handleDeleteClick(3);
      });

      act(() => {
        result.current.handleModalConfirm();
      });

      // onDelete is called in setTimeout, so we need to wait
      setTimeout(() => {
        expect(onDelete.calledOnce).to.be.true;
        expect(onDelete.calledWith(3)).to.be.true;
        done();
      }, 10);
    });

    it('should handle missing onDelete callback gracefully', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.handleDeleteClick(0);
      });

      expect(() => {
        act(() => {
          result.current.handleModalConfirm();
        });
      }).to.not.throw();
    });

    it('should handle non-function onDelete gracefully', () => {
      const { result } = renderHook(() => useDeleteModal('not-a-function'));

      act(() => {
        result.current.handleDeleteClick(0);
      });

      expect(() => {
        act(() => {
          result.current.handleModalConfirm();
        });
      }).to.not.throw();
    });
  });

  describe('Multiple Operations', () => {
    it('should handle multiple open/close cycles', () => {
      const { result } = renderHook(() => useDeleteModal());

      // First cycle
      act(() => {
        result.current.handleDeleteClick(0);
      });
      expect(result.current.isModalOpen).to.be.true;

      act(() => {
        result.current.handleModalCancel();
      });
      expect(result.current.isModalOpen).to.be.false;

      // Second cycle
      act(() => {
        result.current.handleDeleteClick(1);
      });
      expect(result.current.isModalOpen).to.be.true;
      expect(result.current.deleteIndex).to.equal(1);

      act(() => {
        result.current.handleModalCancel();
      });
      expect(result.current.isModalOpen).to.be.false;
      expect(result.current.deleteIndex).to.be.null;
    });
  });
});
