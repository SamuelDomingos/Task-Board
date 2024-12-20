import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  createProjectContainer,
  getAllProjectContainers,
  updateProjectContainer,
  deleteProjectContainer
} from "../service/api";

export const useBlocksManagement = () => {
  const { user } = useContext(AuthContext);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all blocks
  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const response = await getAllProjectContainers(user.token);
      setBlocks(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new block
  const createBlock = async (blockData) => {
    try {
      setLoading(true);
      const response = await createProjectContainer(blockData, user.token);
      setBlocks(prevBlocks => [...prevBlocks, response.block]);
      return response.block;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update block
  const updateBlock = async (blockId, updateData) => {
    try {
      setLoading(true);
      const response = await updateProjectContainer(blockId, updateData, user.token);
      setBlocks(prevBlocks => 
        prevBlocks.map(block => 
          block._id === blockId ? response.block : block
        )
      );
      return response.block;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete block
  const deleteBlock = async (blockId) => {
    try {
      setLoading(true);
      await deleteProjectContainer(blockId, user.token);
      setBlocks(prevBlocks => 
        prevBlocks.filter(block => block._id !== blockId)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of blocks
  useEffect(() => {
    if (user?.token) {
      fetchBlocks();
    }
  }, [user?.token]);

  return {
    blocks,
    loading,
    error,
    createBlock,
    updateBlock,
    deleteBlock,
    refreshBlocks: fetchBlocks,
    setBlocks
  };
};

export default useBlocksManagement;