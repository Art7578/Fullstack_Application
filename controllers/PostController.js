import Post from "../models/Post.js"

export const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create article',
        });
    };
};

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().populate('user').exec();

        res.json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get article',
        });
    };
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await Post.find().populate('user').limit(5).exec();

        const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get tags',
        });
    };
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        
        const getOnePost = await Post.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                new: true, 
            }
        )
        .populate('user'); 

        if (!getOnePost) {
            return res.status(404).json({
                message: 'Article not found',
            });
        }

        res.json(getOnePost);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get article',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({
                message: 'Article not found',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to delete article',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await Post.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.body.user,
                tags: req.body.tags,
            }
        );

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update article',
        });
    }
}